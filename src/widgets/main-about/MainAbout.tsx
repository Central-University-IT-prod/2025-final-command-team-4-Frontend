import { AboutCard } from "@/shared/ui/AboutCard"

export const MainAbout = () => {
    return (
        <section className="mt-10 py-6">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-3">
                    <AboutCard title='Ваш ресурс, а не просто офис' description='BookIT - это не только место для работы, здесь зарождаются полезные знакомства, появляются новые интересы и хобби'/>
                    <AboutCard title='Гибкая аренда' description='Платите только за то, чем вы пользуетесь — выбирайте тарифы, которые подходят под запросы'/>
                    <AboutCard title='Экономия вашего времени' description='Оплачивать тарифы, бронировать переговорные, регистрироваться на мероприятия можно онлайн'/>
                    <AboutCard title='Инфраструктура высокого уровня' description='Дизайны офисов BookIT разработаны лучшими архитекторами России'/>
                </div>
            </div>
        </section>
    )
}