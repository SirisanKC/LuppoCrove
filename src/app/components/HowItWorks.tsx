import { BookOpen, Search, Handshake } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: BookOpen,
      title: "Teachers publish courses",
      description: "University teachers share their courses and research on the platform.",
    },
    {
      icon: Search,
      title: "Companies browse opportunities",
      description: "Organizations discover relevant courses and collaboration possibilities.",
    },
    {
      icon: Handshake,
      title: "Collaboration begins",
      description: "Universities and companies connect to create meaningful partnerships.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl text-center mb-4 text-foreground">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          A simple three-step process to connect education and industry
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Icon */}
              <div className="w-20 h-20 rounded-xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
                <step.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-xl mb-3 text-foreground">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Step number */}
              <div className="mt-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}