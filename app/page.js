"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector , useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleAuthenticated } from "./Redux/Slice";

const phoneSchema = z.object({
  phone: z.string().min(4, "Must be a valid number"),
  dialCode: z.string().min(1, "Select a country"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export default function OtpLoginForm() {
  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [fullPhone, setFullPhone] = useState("");
  const [countries, setCountries] = useState([]);
  const router = useRouter();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.isAuthenticated);
  const theme = useSelector((state) => state.user.theme);
  console.log("theme",theme);
  // console.log("user",auth);
  
  if(auth){
    const confirm = window.confirm("user logged in enter dashboard!!");
    if(!confirm) return;
    router.push("/dashboard");
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,idd");
        const data = await res.json();

        const formatted = data
         .filter(c => c.idd?.root && Array.isArray(c.idd.suffixes) && c.idd.suffixes.length > 0)
         .map(c => ({
          name: c.name.common,
          code: c.idd.root + c.idd.suffixes[0], 
         }))
        .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
      } catch (e) {
        console.error("Failed to fetch countries:", e);
      }
    };

    fetchCountries();
  }, []);

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSendOtp = ({ phone, dialCode }) => {
    const full = dialCode + phone;
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setFullPhone(full);

    console.log(`📤 Sending OTP to ${full}: ${otp}`);

    setTimeout(() => {
      alert(`OTP sent to ${full}: ${otp}`);
      setStep(2);
    }, 1000);
  };

  const onVerifyOtp = ({ otp }) => {
    if (otp === generatedOtp) {
      alert(`✅ OTP verified for ${fullPhone}`);
      dispatch(toggleAuthenticated());
      setStep(1);
    } else {
      alert("❌ Invalid OTP");
    }
  };

  return (
   <div className={`h-screen w-full flex items-center justify-center 
   ${theme ? "bg-white text-black" : "bg-black text-white"}`}>
      <div className="w-full sm:w-[42vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] p-6 border rounded space-y-4 shadow">
      {step === 1 && (
        <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-4">
          <h2 className="text-xl font-semibold">📱 Phone Number</h2>

          <div>
            <label className="block mb-1">Country</label>
            <select
              {...registerPhone("dialCode")}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Country</option>
              {countries.map((c, i) => (
                <option key={i} value={c.code} className={`${theme ? "text-black" : "bg-black text-white"}`}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            {phoneErrors.dialCode && (
              <p className="text-red-500 text-sm">{phoneErrors.dialCode.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="1234567890"
              {...registerPhone("phone")}
              className="w-full border rounded p-2"
            />
            {phoneErrors.phone && (
              <p className="text-red-500 text-sm">{phoneErrors.phone.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
          <h2 className="text-xl font-semibold">🔐 Enter OTP</h2>
          <p className="text-sm text-gray-600">Sent to {fullPhone}</p>

          <div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              {...registerOtp("otp")}
              className="w-full border rounded p-2"
            />
            {otpErrors.otp && (
              <p className="text-red-500 text-sm">{otpErrors.otp.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Verify OTP
          </button>
        </form>
      )}
    </div>
   </div>
  );
}