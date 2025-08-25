// Retain CSS module for complex styles

function formatTicketId(ticketId) {
  if (!ticketId) {
    return "";
  }
  const num = parseInt(ticketId, 10);

  let formattedNum;
  if (num <= 999) {
    formattedNum = num.toString().padStart(4, "0"); // Pad with zeros to make it 4 digits
  } else {
    formattedNum = num.toString();
  }

  return formattedNum;
}

export default function TicketList({
  tickets,
  onViewTicket,

  domainInfo,
  text,
}) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans w-full">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {text.YourTicket}
          </h2>
          <p className="text-gray-600 mb-8">{text.ticketList}</p>
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex justify-between items-center p-6 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:bg-gray-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <span className="font-medium">
                        TKT-{formatTicketId(ticket?.id)}{" "}
                      </span>
                      {ticket.title}
                    </h3>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide `}
                    >
                      {ticket.status}
                    </span>
                    <span>Created: {ticket?.created_at?.split("T")?.[0]}</span>
                  </div>
                </div>
                <button
                  className="px-6 py-3 bg-transparent border border-red-600 text-red-600 rounded-lg font-medium transition-all hover:bg-red-600 hover:text-white"
                  onClick={() => onViewTicket(ticket)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
