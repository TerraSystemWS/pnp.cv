import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { FaUserAlt, FaStar, FaVoteYea } from "react-icons/fa"

interface UserProfileCardProps {
  user: string
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const router = useRouter()
  const pathname = router.pathname

  // Helper function to check if the link is active
  const isActive = (path: string) => pathname === path

  // Avatar URL generator
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user
  )}&background=0D8ABC&color=fff&size=200`

  // Access Links
  const accessLinks = [
    {
      href: "/perfil",
      icon: <FaUserAlt className="mr-3 text-xl" />,
      label: "Perfil",
    },
    {
      href: "/perfil/avaliacao",
      icon: <FaStar className="mr-3 text-xl" />,
      label: "Avaliar Projetos",
    },
    user === "soniarosa" || user === "ailton"
      ? {
          href: "/perfil/votacaopublicaStatus",
          icon: <FaVoteYea className="mr-3 text-xl" />,
          label: "Resultado da Votação Pública",
        }
      : null,
    user === "soniarosa" || user === "ailton" || user === "Solange Cesarovna"
      ? {
          href: "/perfil/avaliacaoStatus",
          icon: <FaVoteYea className="mr-3 text-xl" />,
          label: "Resultado da Avaliação do Jurados",
        }
      : null,
  ].filter(Boolean) // Remove any null entries

  return (
    <div className="col-span-4 sm:col-span-3">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 border-4 border-yellow-500"
            alt={`Avatar de ${user}`}
          />
          <h1 className="text-2xl font-bold text-gray-900">{user}</h1>
        </div>
        <hr className="my-6 border-t border-gray-300" />
        <div className="flex flex-col p-4 w-64 h-screen bg-gray-50 rounded-lg shadow-lg">
          <span className="text-yellow-500 uppercase font-bold tracking-wider mb-6 text-lg">
            Links de Acesso
          </span>
          <ul className="space-y-6">
            {accessLinks.map((link, index) => (
              <li key={index} className="flex items-center mb-4">
                <Link
                  href={link.href}
                  className={`flex items-center p-3 rounded-lg transition duration-300 ease-in-out ${
                    isActive(link.href)
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "hover:bg-yellow-100 hover:text-yellow-500"
                  }`}
                >
                  {link.icon}
                  <span className="text-sm font-semibold">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
