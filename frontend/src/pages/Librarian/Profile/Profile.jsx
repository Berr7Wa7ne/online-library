import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    profilePic: null,
    firstName: "",
    lastName: "",
    displayName: "",
    address: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [editing, setEditing] = useState({
    personal: false,
    bio: false,
    profilePic: false,
  });

  useEffect(() => {
    // Fetch user data from backend
    axios.get("http://localhost:5000/api/librarian/profile")
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => console.error("Error fetching profile data:", error));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

const handleUpdate = (section) => {
    axios.put("/api/profile", profile).then(() => {
      setEditing((prev) => ({ ...prev, [section]: false }));
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    axios.put("http://localhost:5000/api/librarian/profile", profile)
      .then(() => alert("Profile updated successfully!"))
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Profile Picture Section */}
      <div className="flex justify-center mb-6 relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
          {profile.profilePic ? (
            <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          <input type="file" accept="image/*" className="absolute inset-0 opacity-0" onChange={handleFileChange} />
        </div>
      </div>

      {/* Name and Display Name */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">{profile.displayName || "Display Name"}</h2>
        <p className="text-gray-600">{profile.firstName} {profile.lastName}</p>
      </div>

      {/* Personal Information Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          {!editing.personal ? (
            <button onClick={() => setEditing({ personal: true })} className="text-blue-500">Edit</button>
          ) : (
            <button onClick={() => handleUpdate("personal")} className="text-green-500">Save</button>
          )}
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={profile.firstName}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
            disabled={!editing.personal}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={profile.lastName}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
            disabled={!editing.personal}
          />
        </div>
        <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={profile.displayName}
          onChange={handleChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
          disabled={!editing.personal}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
          disabled={!editing.personal}
        />
        </div>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
            disabled={!editing.personal}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg mb-4"
            disabled={!editing.personal}
          />
        </div>
      </div>

      {/* Bio Information Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Bio Information</h3>
          {!editing.bio ? (
            <button onClick={() => setEditing({ bio: true })} className="text-blue-500">Edit</button>
          ) : (
            <button onClick={() => handleUpdate("bio")} className="text-green-500">Save</button>
          )}
        </div>
        <textarea
          name="bio"
          placeholder="Enter Bio"
          value={profile.bio}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg resize-y min-h-[100px]"
          disabled={!editing.bio}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" onClick={() => window.location.reload()}>Cancel</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
