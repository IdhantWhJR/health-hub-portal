import { useState } from "react";
import { useListAllTimeslots, useCreateTimeslot, useDeleteTimeslot, getListAllTimeslotsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export default function AdminTimeslots() {
  const queryClient = useQueryClient();
  const { data: timeslots = [], isLoading } = useListAllTimeslots({
    query: { queryKey: getListAllTimeslotsQueryKey() }
  });
  const deleteTimeslot = useDeleteTimeslot();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: number, isBooked: boolean) => {
    if (isBooked) return;
    if (confirm("Are you sure you want to delete this time slot?")) {
      deleteTimeslot.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllTimeslotsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink">Time Slots</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded-full text-sm hover:bg-olive transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Slot
        </button>
      </div>

      <div className="bg-cream border border-ink/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink/50">Loading...</div>
        ) : timeslots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bone/30 text-[11px] tracking-wider uppercase text-ink/60 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Time Range</th>
                  <th className="px-6 py-4 font-medium">Label</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {timeslots.map(slot => {
                  const isBooked = slot.isBooked;
                  return (
                    <tr key={slot.id} className={cn("transition-colors", isBooked ? "bg-bone/10 opacity-70" : "hover:bg-bone/20")}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-ink/40" />
                          <span className={cn(isBooked ? "text-ink/60" : "text-ink font-medium")}>
                            {format(parseISO(slot.date), 'EEE, MMM d, yyyy')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-ink/80">
                          <Clock className="w-4 h-4 text-ink/40" />
                          {slot.startTime} — {slot.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink/60">
                        {slot.label || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {isBooked ? (
                          <span className="px-2.5 py-1 rounded-full bg-olive/10 text-olive text-[10px] tracking-wider uppercase font-medium">
                            Booked
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-bone text-ink/60 text-[10px] tracking-wider uppercase font-medium">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button 
                            onClick={() => handleDelete(slot.id, isBooked)} 
                            disabled={isBooked}
                            className="text-ink/50 hover:text-terracotta transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isBooked ? "Cannot delete a booked slot" : "Delete slot"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-ink/50">No time slots configured.</div>
        )}
      </div>

      <TimeslotFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
}

function TimeslotFormDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const queryClient = useQueryClient();
  const createTimeslot = useCreateTimeslot();

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    label: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTimeslot.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllTimeslotsQueryKey() });
        setFormData({ date: "", startTime: "", endTime: "", label: "" });
        onClose();
      }
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream w-full max-w-md overflow-hidden rounded-[32px] shadow-xl border border-ink/10 p-8 z-50">
          <Dialog.Title className="font-display text-3xl mb-6">
            Add Time Slot
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Date</label>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] tracking-wider uppercase text-ink/60">Start Time</label>
                  <input 
                    required
                    placeholder="e.g. 10:00 AM"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] tracking-wider uppercase text-ink/60">End Time</label>
                  <input 
                    required
                    placeholder="e.g. 11:00 AM"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Label (Optional)</label>
                <input 
                  placeholder="e.g. Initial Consult"
                  value={formData.label}
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-ink/10">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 rounded-full border border-ink/20 hover:bg-bone transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createTimeslot.isPending}
                className="px-6 py-2 rounded-full bg-ink text-cream hover:bg-olive transition-colors disabled:opacity-50"
              >
                {createTimeslot.isPending ? "Saving..." : "Add Slot"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
