import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { axiosInstance } from "../lib/axios";

function UserProtectedWrapper({ children }) {
  const navigate = useNavigate();
  const { setUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate, setUser]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}

export default UserProtectedWrapper;
