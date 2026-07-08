import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  useListTimeslots, 
  useCreateBooking,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const slotBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
});

const directBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide a brief message"),
});

type SlotBookingData = z.infer<typeof slotBookingSchema>;
type DirectBookingData = z.infer<typeof directBookingSchema>;

export default function Consultations() {
  const { data: timeslots = [], isLoading: isLoadingSlots } = useListTimeslots();
  const createBooking = useCreateBooking();
  
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [slotSuccess, setSlotSuccess] = useState(false);
  const [directSuccess, setDirectSuccess] = useState(false);

  const slotForm = useForm<SlotBookingData>({
    resolver: zodResolver(slotBookingSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" }
  });

  const directForm = useForm<DirectBookingData>({
    resolver: zodResolver(directBookingSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" }
  });

  const onSlotSubmit = (data: SlotBookingData) => {
    if (!selectedSlotId) return;
    createBooking.mutate({
      data: {
        ...data,
        timeslotId: selectedSlotId,
        bookingType: "slot"
      }
    }, {
      onSuccess: () => {
        setSlotSuccess(true);
        slotForm.reset();
        setSelectedSlotId(null);
      }
    });
  };

  const onDirectSubmit = (data: DirectBookingData) => {
    createBooking.mutate({
      data: {
        ...data,
        bookingType: "direct"
      }
    }, {
      onSuccess: () => {
        setDirectSuccess(true);
        directForm.reset();
      }
    });
  };

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-40">
      {/* Time Slots Section */}
      <section className="px-6 md:px-12 mx-auto max-w-[1200px] w-full mb-32">
        <div className="max-w-3xl mb-16">
          <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— Availability</span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl">
            Book a Consultation.
          </h1>
          <p className="mt-6 text-lg text-ink/75 leading-relaxed">
            Select an available time for a brief introductory call or an initial consultation. 
            Times are shown in Indian Standard Time (IST).
          </p>
        </div>

        {slotSuccess ? (
          <div className="p-12 text-center rounded-[32px] bg-olive/10 border border-olive/20">
            <h3 className="font-display text-3xl text-olive mb-4">Request Received</h3>
            <p className="text-ink/70">
              Thank you. We have received your booking request and will be in touch shortly to confirm details.
            </p>
            <button 
              onClick={() => setSlotSuccess(false)}
              className="mt-8 text-[12px] uppercase tracking-widest text-ink/50 hover:text-ink"
            >
              Book another slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col gap-4">
              {isLoadingSlots ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-bone rounded-2xl"></div>)}
                </div>
              ) : timeslots.length > 0 ? (
                <div className="space-y-4">
                  {timeslots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={cn(
                          "w-full text-left p-6 rounded-2xl border transition-all duration-300",
                          isSelected 
                            ? "bg-olive text-cream border-olive shadow-lg" 
                            : "bg-cream border-ink/10 text-ink hover:border-ink/30 hover:bg-bone/50"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={cn("text-[11px] tracking-[0.15em] uppercase font-medium", isSelected ? "text-cream/80" : "text-terracotta")}>
                            {format(new Date(slot.date), 'EEEE, MMMM d')}
                          </div>
                          {slot.label && (
                            <div className={cn("text-[10px] tracking-wider uppercase px-2 py-1 rounded-full", isSelected ? "bg-cream/20" : "bg-bone")}>
                              {slot.label}
                            </div>
                          )}
                        </div>
                        <div className="font-display text-2xl">
                          {slot.startTime} — {slot.endTime}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl border border-ink/10 bg-bone/30 text-ink/60">
                  No time slots currently available online. Please use the direct contact form below.
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              {selectedSlotId ? (
                <div className="bg-bone/40 rounded-[32px] p-8 md:p-12 border border-ink/5">
                  <h3 className="font-display text-2xl mb-8 text-ink">Complete your booking</h3>
                  <form onSubmit={slotForm.handleSubmit(onSlotSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] tracking-[0.1em] uppercase text-ink/60">Full Name</label>
                        <input 
                          {...slotForm.register("name")}
                          className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all" 
                          placeholder="Jane Doe"
                        />
                        {slotForm.formState.errors.name && <p className="text-destructive text-xs">{slotForm.formState.errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] tracking-[0.1em] uppercase text-ink/60">Email</label>
                        <input 
                          {...slotForm.register("email")}
                          type="email"
                          className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all" 
                          placeholder="jane@example.com"
                        />
                        {slotForm.formState.errors.email && <p className="text-destructive text-xs">{slotForm.formState.errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/60">Phone Number (Optional)</label>
                      <input 
                        {...slotForm.register("phone")}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all" 
                        placeholder="+91..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/60">Note (Optional)</label>
                      <textarea 
                        {...slotForm.register("message")}
                        rows={3}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all resize-none" 
                        placeholder="Brief reason for consultation..."
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={createBooking.isPending}
                      className="w-full rounded-full bg-ink text-cream py-4 font-medium tracking-[0.05em] hover:bg-olive transition-colors disabled:opacity-50"
                    >
                      {createBooking.isPending ? "Submitting..." : "Confirm Booking"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 border border-dashed border-ink/20 rounded-[32px] text-ink/40 text-center">
                  Select a time slot on the left to complete your booking request.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Direct Contact Section */}
      <section className="bg-ink text-cream py-32 md:py-40 px-6 md:px-12 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.62 0.115 45 / 0.6), transparent 60%)" }}
        />
        <div className="mx-auto max-w-[1200px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <span className="text-[12px] tracking-[0.2em] uppercase text-cream/50">— Direct</span>
              <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
                Prefer a different time?
              </h2>
              <p className="mt-6 text-lg text-cream/70 leading-relaxed mb-12">
                If the available slots don't fit your schedule, or if you'd like to inquire about corporate wellness programs, send a direct message.
              </p>
              
              <div className="space-y-6 pt-12 border-t border-cream/15">
                <a
                  href="mailto:shwetavtripathi@gmail.com"
                  className="group flex items-center justify-between text-cream hover:text-sand transition-colors"
                >
                  <span className="font-display text-xl">shwetavtripathi@gmail.com</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="tel:+919902275240"
                  className="group flex items-center justify-between text-cream hover:text-sand transition-colors"
                >
                  <span className="font-display text-xl">+91 99022 75240</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              {directSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-cream/5 rounded-[32px] border border-cream/10 p-12">
                  <h3 className="font-display text-3xl mb-4">Message Sent</h3>
                  <p className="text-cream/70">
                    Thank you for reaching out. We will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setDirectSuccess(false)}
                    className="mt-8 text-[12px] uppercase tracking-widest text-cream/50 hover:text-cream"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={directForm.handleSubmit(onDirectSubmit)} className="space-y-6 bg-cream/5 p-8 md:p-12 rounded-[32px] border border-cream/10 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-[0.1em] uppercase text-cream/60">Full Name</label>
                      <input 
                        {...directForm.register("name")}
                        className="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-cream transition-all placeholder:text-cream/20" 
                        placeholder="Your name"
                      />
                      {directForm.formState.errors.name && <p className="text-terracotta text-xs">{directForm.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] tracking-[0.1em] uppercase text-cream/60">Email</label>
                      <input 
                        {...directForm.register("email")}
                        type="email"
                        className="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-cream transition-all placeholder:text-cream/20" 
                        placeholder="your@email.com"
                      />
                      {directForm.formState.errors.email && <p className="text-terracotta text-xs">{directForm.formState.errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] tracking-[0.1em] uppercase text-cream/60">Phone Number (Optional)</label>
                    <input 
                      {...directForm.register("phone")}
                      className="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-cream transition-all placeholder:text-cream/20" 
                      placeholder="+91..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] tracking-[0.1em] uppercase text-cream/60">Message</label>
                    <textarea 
                      {...directForm.register("message")}
                      rows={4}
                      className="w-full bg-transparent border-b border-cream/20 py-3 focus:outline-none focus:border-cream transition-all placeholder:text-cream/20 resize-none" 
                      placeholder="How can we help you?"
                    />
                    {directForm.formState.errors.message && <p className="text-terracotta text-xs">{directForm.formState.errors.message.message}</p>}
                  </div>
                  <button 
                    type="submit"
                    disabled={createBooking.isPending}
                    className="w-full rounded-full bg-cream text-ink py-4 font-medium tracking-[0.05em] hover:bg-sand transition-colors disabled:opacity-50 mt-4"
                  >
                    {createBooking.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
