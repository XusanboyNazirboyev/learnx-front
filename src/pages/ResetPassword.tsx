import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  return (
    <AuthLayout icon={KeyRound} title="Reset password" subtitle="Password reset is managed by an EduFlow administrator.">
      <Link className="block w-full rounded-md bg-primary px-4 py-3 text-center text-primary-foreground" to="/login">
        Back to login
      </Link>
    </AuthLayout>
  );
}
