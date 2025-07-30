
"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector , useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleAuthenticated } from "./Redux/Slice";
import axios from "axios";

const phoneSchema = z.object({
  countryCode: z.string().nonempty("Select country code"),
  phone: z.string().min(6, "Phone number too short"),
});

export default function OtpLoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [countries, setCountries] = useState([]);
  const router = useRouter();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.isAuthenticated);
  const theme = useSelector((state) => state.user.theme);
  console.log("theme",theme);
  // console.log("user",auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { countryCode: "", phone: "" },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=idd,name");
        const countryCodes = res.data
          .filter(c => c.idd?.root && c.idd?.suffixes)
          .map(c => ({
            name: c.name.common,
            dialCode: c.idd.root + c.idd.suffixes[0],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryCodes);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    fetchCountries();
  }, []);

   if(auth){
    const confirm = window.confirm("user logged in enter dashboard!!");
    if(!confirm) return;
    router.push("/dashboard");
  }

  const sendOtp = (data) => {
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(fakeOtp);
    setOtpSent(true);
    setTimeout(() => {
      alert(`Simulated OTP sent: ${fakeOtp}`); // simulate sending
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert("OTP Verified!");
      dispatch(toggleAuthenticated());
    } else {
      alert("Incorrect OTP.");
    }
  };

  return (
    <div className={`h-screen w-full flex items-center justify-center 
   ${theme ? "bg-white text-black" : "bg-black text-white"}`}>
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
      {!otpSent ? (
        <form onSubmit={handleSubmit(sendOtp)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Country Code</label>
            <select {...register("countryCode")} className="w-full border p-2 rounded">
              <option value="">Select</option>
              {countries.map((c) => (
                <option key={c.dialCode} value={c.dialCode}>
                  {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
            {errors.countryCode && (
              <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full border p-2 rounded"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send OTP
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <label className="block mb-1 font-medium">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="6-digit OTP"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
    </div>
  );
}