import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CalendarDays, User, Building, Mail, Phone, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import ReCaptcha, { ReCaptchaRef } from "@/components/ReCaptcha";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

const BookDemo = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCaptchaRef>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(2);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("demo_bookings").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        phone: formData.phone || null,
        preferred_date: format(selectedDate, "yyyy-MM-dd"),
        preferred_time: selectedTime,
        message: formData.message || null
      });

      if (error) throw error;

      // Send confirmation emails
      try {
        await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            customerName: formData.name,
            customerEmail: formData.email,
            company: formData.company,
            phone: formData.phone,
            preferredDate: format(selectedDate, "EEEE, MMMM do, yyyy"),
            preferredTime: selectedTime,
            message: formData.message
          }
        });
      } catch (emailError) {
        console.error("Email error (non-blocking):", emailError);
      }

      setIsBooked(true);
      toast.success("Demo booked successfully! Check your email for confirmation.");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book demo. Please try again.");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
            You're All Set!
          </h1>
          <p className="text-gray-600 mb-2">
            Your demo is scheduled for
          </p>
          <p className="text-xl font-semibold text-[#4B5FD1] mb-6">
            {selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")} at {selectedTime}
          </p>
          <p className="text-gray-600 mb-8">
            We've sent a confirmation to <strong>{formData.email}</strong>. Our team will reach out shortly!
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#4B5FD1] hover:bg-[#3a4db8] text-white"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Book a Demo</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4B5FD1] mb-4"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Schedule Your Demo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See how our AI employees can transform your business. Pick a time that works for you.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: "Date", icon: CalendarDays },
              { num: 2, label: "Time", icon: Clock },
              { num: 3, label: "Details", icon: User }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    step >= s.num
                      ? "bg-[#4B5FD1] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  animate={{ scale: step === s.num ? 1.05 : 1 }}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                </motion.div>
                {i < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.num ? "bg-[#4B5FD1]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Calendar & Time Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Calendar */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#4B5FD1]" />
                Select a Date
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const day = date.getDay();
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return day === 0 || day === 6 || date < today;
                }}
                className="rounded-lg border-0 pointer-events-auto bg-white"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-gray-900",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal text-gray-900 hover:bg-gray-100 rounded-md inline-flex items-center justify-center",
                  day_selected: "bg-[#4B5FD1] text-white hover:bg-[#3a4db8] hover:text-white focus:bg-[#4B5FD1] focus:text-white rounded-md",
                  day_today: "bg-gray-100 text-gray-900",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-50",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Time Slots */}
            {step >= 2 && selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4B5FD1]" />
                  Select a Time
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {format(selectedDate, "EEEE, MMMM do, yyyy")}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-[#4B5FD1] text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-[#4B5FD1] hover:text-[#4B5FD1]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Contact Form */}
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#4B5FD1]" />
                Your Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-gray-700 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Smith"
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4B5FD1] focus:ring-[#4B5FD1]"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@company.com"
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4B5FD1] focus:ring-[#4B5FD1]"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-700 flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4" />
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4B5FD1] focus:ring-[#4B5FD1]"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 800 654 6949"
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4B5FD1] focus:ring-[#4B5FD1]"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 mb-2 block">
                    Anything specific you'd like to discuss?
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your business needs..."
                    rows={3}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#4B5FD1] focus:ring-[#4B5FD1]"
                  />
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
                    {" at "}
                    <span className="font-medium">{selectedTime}</span>
                  </p>
                </div>

                <ReCaptcha
                  ref={recaptchaRef}
                  onChange={handleRecaptchaChange}
                  onExpired={handleRecaptchaExpired}
                  className="flex flex-col items-center"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken}
                  className="w-full bg-[#4B5FD1] hover:bg-[#3a4db8] text-white py-6 text-lg font-medium"
                >
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By booking, you agree to our{" "}
                  <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link to="/terms" className="underline hover:text-gray-700">Terms & Conditions</Link>.
                </p>
              </form>
            </motion.div>
          )}

          {/* Placeholder when form not visible */}
          {step < 3 && (
            <div className="hidden lg:flex items-center justify-center bg-gray-50 rounded-2xl p-6">
              <div className="text-center text-gray-400">
                <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a date and time to continue</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDemo;