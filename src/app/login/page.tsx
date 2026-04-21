"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Lock } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result?.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-[#00B4D8]/10 p-4 rounded-2xl">
              <TrendingUp className="h-10 w-10 text-[#00B4D8]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">FinDash</h1>
          <p className="text-[#8D99AE] text-sm">Gestão Financeira Pessoal</p>
        </div>

        <Card className="bg-[#16213E] border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#00B4D8]" />
              Acesso seguro
            </CardTitle>
            <CardDescription className="text-[#8D99AE]">
              Entre com seu email e senha para acessar o dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#E2E8F0]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-[#8D99AE] focus:border-[#00B4D8]"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[#EF476F] text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#E2E8F0]">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#1A1A2E] border-white/10 text-white placeholder:text-[#8D99AE] focus:border-[#00B4D8]"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-[#EF476F] text-xs">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B4D8] hover:bg-[#0096c7] text-white font-semibold transition-colors"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#8D99AE]">
          Acesso restrito — dados protegidos por autenticação.
        </p>
      </div>
    </div>
  );
}
