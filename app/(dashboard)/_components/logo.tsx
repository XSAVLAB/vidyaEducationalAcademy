import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      height={200}
      width={200}
      priority
      alt="logo"
      src="/logo.webp"
    />
  )
}