import { useState, useMemo } from "react";
import { useListBookings, useDeleteBooking, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Phone, Mail, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useListBookings({
    query: { queryKey: getListBookingsQueryKey() }
  });
  const deleteBooking = useDeleteBooking();

  const [activeTab, setActiveTab] = useState<"all" | "slot" | "direct">("all");

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;
    return bookings.filter(b => b.bookingType === activeTab);
  }, [bookings, activeTab]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this booking request?")) {
      deleteBooking.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink">Bookings</h1>
      </div>

      <div className="flex items-center gap-2 p-1 bg-bone/30 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-colors",
            activeTab === "all" ? "bg-cream shadow-sm text-ink font-medium" : "text-ink/60 hover:text-ink"
          )}
        >
          All Requests
        </button>
        <button
          onClick={() => setActiveTab("slot")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-colors",
            activeTab === "slot" ? "bg-cream shadow-sm text-ink font-medium" : "text-ink/60 hover:text-ink"
          )}
        >
          Slot Bookings
        </button>
        <button
          onClick={() => setActiveTab("direct")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-colors",
            activeTab === "direct" ? "bg-cream shadow-sm text-ink font-medium" : "text-ink/60 hover:text-ink"
          )}
        >
          Direct Contacts
        </button>
      </div>

      <div className="bg-cream border border-ink/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink/50">Loading...</div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bone/30 text-[11px] tracking-wider uppercase text-ink/60 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-bone/20 transition-colors align-top">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink mb-1">{booking.name}</div>
                      <div className="flex items-center gap-1.5 text-ink/60 text-xs mb-1">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${booking.email}`} className="hover:underline">{booking.email}</a>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-1.5 text-ink/60 text-xs">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-2">
                        {booking.bookingType === 'slot' ? (
                          <span className="px-2 py-0.5 rounded bg-olive/10 text-olive text-[10px] tracking-wider uppercase font-medium">
                            Slot Booking
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-terracotta/10 text-terracotta text-[10px] tracking-wider uppercase font-medium">
                            Direct Contact
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink/50">
                        Received {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.message ? (
                        <div className="text-ink/80 text-sm max-w-sm line-clamp-3" title={booking.message}>
                          {booking.message}
                        </div>
                      ) : (
                        <span className="text-ink/30 italic">No message provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => handleDelete(booking.id)} 
                          className="text-ink/50 hover:text-terracotta transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-ink/50">No bookings found in this category.</div>
        )}
      </div>
    </div>
  );
}
