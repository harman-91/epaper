"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NewTicketForm from "./NewTicketForm";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";
import { getSupportMeta } from "@/component/meta/supportMeta";

export default function ClientSupportPage({
  profileData,
  supportList,
  categories,
  auth,
  query,
  domainInfo,
}) {
  const [currentView, setCurrentView] = useState("new");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState(supportList);
  const [formData, setFormData] = useState({
    firstName: profileData?.first_name || "",
    lastName: profileData?.last_name || "",
    email: profileData?.email || "",
    phone: profileData?.mobile_no || "",
    title: "",
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const text = getSupportMeta(domainInfo?.domainId);

  useEffect(() => {
    if (currentView === "list") {
      const fetchTickets = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/support/user/tickets`,
            { domain_url: process.env.DOMAIN },
            { headers: { Authorization: `Bearer ${auth}` } }
          );
          setTickets(response.data.data || []);
        } catch (err) {
          console.error("Error fetching tickets:", err);
          setTickets([]);
        }
      };
      fetchTickets();
    }
  }, [currentView, auth]);

  const handleCreateTicket = async () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = text.firstNameRequired;
    if (!formData.lastName.trim()) newErrors.lastName = text.lastNameRequired;
    if (!formData.email.trim()) newErrors.email = text.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = text.invalidEmail;
    if (!formData.title.trim()) newErrors.title = text.titleRequired;
    if (!formData.category) newErrors.category = text.categoryRequired;
    if (!formData.description.trim())
      newErrors.description = text.descriptionRequired;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
    const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      selectedFiles.forEach((file) =>
        formDataToSend.append("support_image", file)
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/support/user/ticket/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newTicket = {
        id: `JST-${Date.now()}`,
        title: formData.title,
        status: "Open",
        lastUpdated: new Date().toLocaleString(),
        category: formData.category,
        description: formData.description,
        messages: [],
      };

      setTickets([newTicket, ...tickets]);
      setShowSuccess(true);
      setFormData({
        firstName: profileData?.first_name || "",
        lastName: profileData?.last_name || "",
        email: profileData?.email || "",
        phone: profileData?.mobile_no || "",
        title: "",
        category: "",
        description: "",
      });
      setSelectedFiles([]);
      setActiveQuickAction(null);
      setCurrentView("list");
    } catch (error) {
      setErrors({ submit: text.submitFailed });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "John Doe",
      role: "User",
      content: replyMessage,
      timestamp: new Date().toLocaleString(),
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...(selectedTicket.messages || []), newMessage],
      lastUpdated: new Date().toLocaleString(),
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
    setReplyMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <script
        id="datalayer"
        dangerouslySetInnerHTML={{
          __html: `var dataLayer = window.dataLayer || []; dataLayer.push({'event':'pageview','tvc_page_type':'manage_profile_page','language':'hindi','uid': 'na',
            'usertype': 'na',
            'registration_status': 'na',
            'loggeduser_id': 'na'});`,
        }}
      />
      <div className="max-w-4xl mx-auto flex p-0 md:p-5 lg:p-5">
        <div className="min-h-screen bg-gray-100 font-sans w-full p-4">
          <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-sm">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
              {text.welcome}, {profileData.first_name || text.reader}
            </h1>
            <div className="flex gap-2 mb-6 justify-center">
              <button
                className={`px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 ${
                  currentView === "new"
                    ? "bg-[#da251d] text-white border-[#da251d]"
                    : ""
                }`}
                onClick={() => setCurrentView("new")}
              >
                {text.newTicket}
              </button>
              <button
                className={`px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 ${
                  currentView === "list"
                    ? "bg-[#da251d] text-white border-[#da251d]"
                    : ""
                }`}
                onClick={() => setCurrentView("list")}
              >
                {text.myTickets}
              </button>
            </div>
            <div id="mobile-root"></div>
            {currentView === "new" && (
              <NewTicketForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                activeQuickAction={activeQuickAction}
                setActiveQuickAction={setActiveQuickAction}
                showSuccess={showSuccess}
                isSubmitting={isSubmitting}
                onCreateTicket={handleCreateTicket}
                onCancel={() => setCurrentView("list")}
                profileData={profileData}
                auth={auth}
                categories={categories}
                domainInfo={domainInfo}
              />
            )}
            {currentView === "list" && (
              <TicketList
                tickets={tickets}
                onViewTicket={(ticket) => {
                  setSelectedTicket(ticket);
                  setCurrentView("detail");
                }}
                onNewTicket={() => setCurrentView("new")}
                profileData={profileData}
                supportList={supportList}
                text={text}
              />
            )}
            {currentView === "detail" && selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                onBack={() => setCurrentView("list")}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
                onSendReply={handleSendReply}
                text={text}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
