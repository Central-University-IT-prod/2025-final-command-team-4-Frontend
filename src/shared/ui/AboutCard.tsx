export const AboutCard = ({title, description}: Record<string, string>) => {
    return (
        <article className="bg-white p-6 rounded-lg shadow-md text-center transition duration-200 ease-in-out hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {title}
            </h2>
            <p className="text-gray-600">
                {description}
            </p>
        </article>
    )
}