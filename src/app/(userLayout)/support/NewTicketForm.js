"use client";

import { useRef, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { updateUserEmail, updateUserMobile } from "@/store/slice/userSlice";
import GoogleLoginBtn from "@/component/account/googleLogin";
import UpdateMobile from "@/component/account/updateMobile";
import { getSupportMeta } from "@/component/meta/supportMeta";

const quickActionIcons = {
  "Billing & Payment Related Issues": "💳",
  "Subscription Purchase / Trial Issues": "💎",
  "Plan Upgrade / Downgrade": "📈",
  "Subscription Cancellation": "🚫",
  "Renewal & Auto-Renewal Issues": "🔄",
  "Invoice Related": "🧾",
  Others: "⚙️",
};

export default function NewTicketForm({
  formData,
  setFormData,
  errors,
  setErrors,
  selectedFiles,
  setSelectedFiles,
  activeQuickAction,
  setActiveQuickAction,
  showSuccess,
  isSubmitting,
  onCreateTicket,
  onCancel,
  profileData,
  auth,
  categories,
  domainInfo,
}) {
  const dispatch = useDispatch();
  const [updateMobile, setUpdateMobile] = useState(false);
  const fileInputRef = useRef(null);
  const text = getSupportMeta(domainInfo?.domainId);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleQuickAction = (type) => {
    setActiveQuickAction(type);
    setFormData({ ...formData, category: type });
    setErrors({ ...errors, category: "" });

    switch (type) {
      case "billing":
        setFormData({
          ...formData,
          title: "Billing Issue - ",
          category: type,
          description:
            "I need help with a billing-related issue. Please include details about:\n- What specific billing problem you're experiencing\n- Your subscription plan\n- Any error messages you've received\n- When the issue started",
        });
        break;
      case "technical":
        setFormData({
          ...formData,
          title: "Technical Issue - ",
          category: type,
          description:
            "I'm experiencing a technical problem. Please describe:\n- What you were trying to do when the problem occurred\n- Any error messages you received\n- Your device and browser information\n- Steps to reproduce the issue",
        });
        break;
      case "content":
        setFormData({
          ...formData,
          title: "Content/Delivery Issue - ",
          category: type,
          description:
            "I have an issue with content or delivery. Please specify:\n- What content is missing or incorrect\n- When you noticed the issue\n- Whether this affects all content or specific articles\n- Your notification preferences",
        });
        break;
      case "account":
        setFormData({
          ...formData,
          title: "Account Management - ",
          category: type,
          description:
            "I need help with my account. Please describe:\n- What account changes you need\n- Any issues accessing your account\n- Specific features you need help with",
        });
        break;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files
      .filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024)
      .slice(0, 2 - selectedFiles.length);
    setSelectedFiles([...selectedFiles, ...validFiles].slice(0, 2));
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const onUpdateEmail = (email) => {
    setFormData({ ...formData, email: email.email });
    setErrors({});
    dispatch(updateUserEmail(email.email));
  };

  const onUpdateEmailError = (msg) => {
    setErrors({ ...errors, email: msg });
  };

  return (
    <div className="max-w-2xl mx-auto p-0 md:p-6 bg-white rounded-xl shadow-sm">
      {updateMobile && (
        <UpdateMobile
          showModal={updateMobile}
          token={auth}
          onCloseModal={(mobile) => {
            setFormData({ ...formData, phone: mobile });
            dispatch(updateUserMobile(mobile));
            setUpdateMobile(false);
          }}
          onClose={() => setUpdateMobile(false)}
        />
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{text.createSupportTicket}</h2>
      <p className="text-gray-600 mb-6 text-sm">{text.selectCategoryInstruction}</p>
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-lg mb-5 text-center text-sm">
          Ticket submitted successfully! We&apos;ll get back to you within 24 hours.
        </div>
      )}
      {errors.submit && (
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-lg mb-5 text-center text-sm">
          {errors.submit}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((action) => (
          <div
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            className={`p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-center cursor-pointer transition-all ${
              activeQuickAction === action.id
                ? "bg-red-600 text-white border-red-600 transform -translate-y-0.5 shadow-lg"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="text-2xl mb-2">{quickActionIcons[action.category_en] || "🔄"}</div>
            <div className="font-semibold text-sm">{action.category_hi}</div>
          </div>
        ))}
      </div>
      {errors.category && <p className="text-red-600 text-sm mb-4">{errors.category}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block font-medium text-gray-900 text-sm mb-1">{text.firstNameLabel}</label>
          <input
            type="text"
            className={`w-full p-3 border rounded-md text-black bg-white border-solid ${
              errors.firstName ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-900 text-sm mb-1">{text.lastNameLabel}</label>
          <input
            type="text"
            className={`w-full p-3 border rounded-md text-black bg-white border-solid ${
              errors.lastName ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block font-medium text-gray-900 text-sm mb-1">{text.emailLabel}</label>
          {formData.email ? (
            <input
              type="email"
              className={`w-full p-3 border rounded-md text-black bg-white border-solid ${
                errors.email ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled
            />
          ) : (
            <GoogleOAuthProvider clientId="247545486737-0f0plg20qounrs8k1qjbkdp0bd57trrb.apps.googleusercontent.com">
              <GoogleLoginBtn
                onSuccess={onUpdateEmail}
                onError={onUpdateEmailError}
                auth={auth}
                size="large"
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-center font-medium text-sm"
              />
            </GoogleOAuthProvider>
          )}
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-900 text-sm mb-1">{text.mobileNumberLabel}</label>
          {formData.phone ? (
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-white border-solid"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled
            />
          ) : (
            <button
              className="w-full p-2 bg-black text-white rounded-md font-medium text-sm hover:bg-red-700"
              onClick={() => setUpdateMobile(true)}
            >
              {text.addMobileNumber}
            </button>
          )}
        </div>
      </div>
      <div className="mb-5">
        <label className="block font-medium text-gray-900 text-sm mb-1">{text.titleLabel}</label>
        <input
          type="text"
          className={`w-full p-3 border rounded-md text-black bg-white border-solid ${
            errors.title ? "border-red-600" : "border-gray-300"
          } focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10`}
          placeholder="छोटा-सा टाइटल लिखें अपनी दिक्कत का"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
      </div>
      <div className="mb-5">
        <label className="block font-medium text-gray-900 text-sm mb-1">{text.descriptionLabel}</label>
        <textarea
          className={`w-full p-3 border rounded-md text-black bg-white min-h-[120px] resize-y border-solid ${
            errors.description ? "border-red-600" : "border-gray-300"
          } focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10`}
          placeholder="अपनी दिक्कत के बारे में जितना हो सके उतना लिखें"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
      </div>
      <div className="mb-5">
        <label className="block font-medium text-gray-900 text-sm mb-1">{text.addPhotosLabel}</label>
        {selectedFiles.length < 2 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 hover:border-red-600 hover:bg-blue-50 cursor-pointer"
          >
            <div className="text-3xl mb-2">📎</div>
            <p className="font-semibold text-sm">{text.clickToUpload}</p>
            <p className="text-gray-600 text-xs mt-1">{text.photoUploadInstruction}</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        {selectedFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative border-2 border-gray-200 rounded-lg p-1 bg-white">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
                <p className="text-gray-600 text-xs text-center mt-1 break-words">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`w-full p-3 bg-red-600 text-white rounded-md font-medium text-sm ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-red-700"
        }`}
        onClick={onCreateTicket}
        disabled={isSubmitting}
      >
        {isSubmitting ? text.submitting : text.submitTicket}
      </button>
    </div>
  );
}
