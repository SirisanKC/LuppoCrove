import { useState } from "react";
import { GraduationCap, Building2, CheckCircle2 } from "lucide-react";

interface RegistrationCardProps {
  type: "teacher" | "company";
}

export function RegistrationCard({ type }: RegistrationCardProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    keycode: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isTeacher = type === "teacher";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${type} registration:`, formData);
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        organization: "",
        keycode: "",
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6">
        {isTeacher ? (
          <GraduationCap className="w-7 h-7 text-primary" />
        ) : (
          <Building2 className="w-7 h-7 text-primary" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl mb-3 text-foreground">
        {isTeacher ? "For University Teachers" : "For Companies"}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {isTeacher
          ? "Use your university keycode to join and publish your courses."
          : "Use your company keycode to access university courses and explore collaboration opportunities."}
      </p>

      {/* Form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={`${type}-name`} className="block text-sm mb-2 text-foreground">
              Name
            </label>
            <input
              type="text"
              id={`${type}-name`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor={`${type}-email`} className="block text-sm mb-2 text-foreground">
              Email
            </label>
            <input
              type="email"
              id={`${type}-email`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor={`${type}-organization`} className="block text-sm mb-2 text-foreground">
              {isTeacher ? "University" : "Company"}
            </label>
            <input
              type="text"
              id={`${type}-organization`}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder={isTeacher ? "University name" : "Company name"}
            />
          </div>

          <div>
            <label htmlFor={`${type}-keycode`} className="block text-sm mb-2 text-foreground">
              Keycode
            </label>
            <input
              type="text"
              id={`${type}-keycode`}
              name="keycode"
              value={formData.keycode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Enter your keycode"
            />
          </div>

          {!isTeacher && (
            <p className="text-sm text-muted-foreground italic">
              Annual fee applies. Keycode may include special pricing.
            </p>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md mt-6"
          >
            Create {isTeacher ? "Teacher" : "Company"} Account
          </button>
        </form>
      ) : (
        <div className="py-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-lg text-foreground">Registration successful!</p>
          <p className="text-sm text-muted-foreground mt-2">Check your email for next steps.</p>
        </div>
      )}
    </div>
  );
}
