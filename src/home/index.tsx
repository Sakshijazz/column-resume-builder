import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, FileText, Zap, Shield } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Create Your Perfect Resume with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Craft a professional resume in minutes with our AI-powered tools
        </p>
        <Link to={isSignedIn ? "/dashboard" : "/auth/sign-in"}>
          <Button size="lg" className="text-lg px-8">
            {isSignedIn ? "Go to Dashboard" : "Start Building"}{" "}
            <ArrowRight className="ml-2" />
          </Button>
        </Link>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-yellow-500" />}
            title="AI-Powered"
            description="Our AI analyzes your information to create tailored resumes"
          />
          <FeatureCard
            icon={<FileText className="w-12 h-12 text-green-500" />}
            title="Multiple Templates"
            description="Choose from a variety of professional templates"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-blue-500" />}
            title="ATS-Friendly"
            description="Ensure your resume passes Applicant Tracking Systems"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
