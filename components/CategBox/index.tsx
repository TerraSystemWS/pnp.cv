import { useEffect } from "react"

const CategBox = ({ dados }: any) => {
  console.log(dados)

  // Scroll behavior adjustment for anchor links
  useEffect(() => {
    // Adiciona um evento de rolagem para os links com âncoras
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId: any = link.getAttribute("href")?.substring(1)
        const targetElement: any = document.getElementById(targetId)

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 230, // Ajuste o valor conforme a altura do menu
            behavior: "smooth",
          })
        }
      })
    })
  }, [])
  return (
    <>
      {/* Box fixo à esquerda com links para as categorias */}
      <div className="w-64 fixed top-32 left-1 z-5 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out ">
        <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text mb-4 uppercase">
          Categorias
        </h2>

        <ul className="space-y-3">
          {dados.map((category: any) => (
            <li key={category.id} className="group relative">
              <a
                href={`#${category.slug}`}
                className="text-lg text-gray-800 hover:text-yellow-500 transition-colors duration-300 group-hover:pl-2"
              >
                {category.titulo}
              </a>
              <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default CategBox
