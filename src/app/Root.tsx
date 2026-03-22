import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../app/components/Header";
import { Hero } from "../app/components/Hero";
import { SignUp } from "../app/components/SignUp";
import { HowItWorks } from "../app/components/HowItWorks";
import { Footer } from "../app/components/Footer";

type UserType = "teacher" | "company";

export function Root() {
  const navigate = useNavigate();
  const registrationRef = useRef<HTMLDivElement>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType>("teacher");

  const scrollToRegistration = (userType: UserType) => {
    setSelectedUserType(userType);
    registrationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onLoginClick={() => navigate("/login")}
        onUniversitiesClick={() => scrollToRegistration("teacher")}
        onCompaniesClick={() => scrollToRegistration("company")}
      />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onRegisterTeacher={() => scrollToRegistration("teacher")}
          onRegisterCompany={() => scrollToRegistration("company")}
        />

        {/* Sign Up Section */}
        <section 
          id="sign-up"
          ref={registrationRef} 
          className="w-full py-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-4 text-foreground">
              Join LuppoGrove
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Create your account to start connecting universities and companies
            </p>

            <SignUp initialUserType={selectedUserType} />
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Contact Section */}
        <section id="contact" className="w-full py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Have questions?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              We're here to help you get started. Reach out to our team anytime.
            </p>
            <a 
              href="mailto:contact@luppogrove.com"
              className="inline-flex px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-sm hover:shadow-md"
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}