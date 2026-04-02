import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import BASE_URL from "../utils/baseURL";

function Register() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // ✅ REGISTER FUNCTION
  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      let { role, profileImageUrl, ...userObj } = newUser;

      // ✅ Role validation
      if (!role) {
        setError("Please select a role");
        setLoading(false);
        return;
      }

      // ✅ Append text fields
      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });

      // ✅ Append image safely
      if (profileImageUrl && profileImageUrl.length > 0) {
        formData.append("profileImageUrl", profileImageUrl[0]);
      }

      // ✅ Select API based on role
      let url = "";

      if (role === "USER") {
        url = `${BASE_URL}/user-api/users`;
      } else if (role === "AUTHOR") {
        url = `${BASE_URL}/author-api/users`;
      }

      // ✅ API call
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ cleanup preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading) {
    return <p className={loadingClass}>Registering...</p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {/* ERROR */}
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          
          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="USER"   // ✅ FIXED
                  className="accent-violet-600 w-4 h-4"
                />
                <span>User</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="AUTHOR"   // ✅ FIXED
                  className="accent-violet-600 w-4 h-4"
                />
                <span>Author</span>
              </label>
            </div>
          </div>

          <div className={divider} />

          {/* NAME */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input {...register("firstName")} className={inputClass} />
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input {...register("lastName")} className={inputClass} />
            </div>
          </div>

          {/* EMAIL */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input type="email" {...register("email")} className={inputClass} />
          </div>

          {/* PASSWORD */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input type="password" {...register("password")} className={inputClass} />
          </div>

          {/* IMAGE */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profileImageUrl")}
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("Only JPG/PNG allowed");
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    setError("Max size 2MB");
                    return;
                  }

                  setPreview(URL.createObjectURL(file));
                  setError(null);
                }
              }}
            />

            {preview && (
              <div className="mt-3 flex justify-center">
                <img src={preview} className="w-24 h-24 rounded-full" />
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        {/* FOOTER */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-violet-600">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;