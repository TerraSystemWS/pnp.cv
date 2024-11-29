const HeroSection = ({ title, subtitle }: any) => {
  return (
    <>
      {/* Titulo - noticias */}
      <section className="bg-gradient-to-r from-[#e6e2d8] via-white to-[#e6e2d8] py-12 text-center rounded-lg shadow-xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-tight transform transition duration-500 hover:scale-105 hover:text-yellow-500">
          {title}
        </h1>
        <p className="mt-4 text-xl text-gray-600 opacity-80">{subtitle}</p>
      </section>
    </>
  )
}

export default HeroSection
