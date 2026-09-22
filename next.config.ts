import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // el nav/permisos cambian segun cookie (rol real y vista previa de admin);
  // sin esto, el router cache del cliente sirve paginas viejas al navegar
  // por links despues de cambiar de rol.
  experimental: {
    staleTimes: { dynamic: 0 },
  },
};

export default nextConfig;
