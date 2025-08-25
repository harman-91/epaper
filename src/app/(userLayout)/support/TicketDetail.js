import { useState } from "react";
import styles from "@/styles/Support.module.css";

export default function TicketDetail({ ticket, onBack, onSendReply }) {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    onSendReply(replyMessage);
    setReplyMessage("");
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Tickets
        </button>

        <div className={styles.ticketDetail}>
          <div className={styles.ticketDetailHeader}>
            <h1 className={styles.ticketDetailTitle}>{ticket.title}</h1>
            <span
              className={`${styles.status} ${
                styles[ticket.status.toLowerCase().replace(" ", "")]
              }`}
            >
              {ticket.status}
            </span>
          </div>
          <div className={styles.ticketDetailMeta}>
            <span>Ticket #{ticket.id}</span>
            <span>{ticket.title}</span>
          </div>
          <div>{ticket.description}</div>

          {/* <div className={styles.messagesContainer}>
            {ticket.messages && ticket.messages.length > 0 ? (
              ticket.messages.map(message => (
                <div key={message.id} className={styles.message}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageSender}>{message.sender}</span>
                    <span className={styles.messageRole}>{message.role}</span>
                    <span className={styles.messageTime}>{message.timestamp}</span>
                  </div>
                  <div className={styles.messageContent}>{message.content}</div>
                </div>
              ))
            ) : (
              <div className={styles.noMessages}>
                <p>No messages yet. Start the conversation by adding a reply below.</p>
              </div>
            )}
          </div>

          <div className={styles.replySection}>
            <h3 className={styles.replyTitle}>Add Reply</h3>
            <textarea
              className={styles.replyTextarea}
              placeholder="Type your message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <button 
              className={styles.replyButton}
              onClick={handleSendReply}
            >
              Send Reply
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
