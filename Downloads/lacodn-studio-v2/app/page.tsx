import HomePageForm from "@/components/home"

export default function Home() {
    return (
        <div className="space-y-6 sm:px-10 sm:py-6 px-4 py-3">
            <h1 className="sm:text-4xl text-2xl font-bold text-center">{"Loc'd"} N Studios</h1>
            <HomePageForm />
        </div>
    )
}
