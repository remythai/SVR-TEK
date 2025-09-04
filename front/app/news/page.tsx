import { getNews } from "../requests/news";

export default async function news() {

    const news = await getNews();

    return (
        <div className="w-full h-full flex justify-center flex-col items-center mt-30">
            <h1 className="text-3xl font-bold text-center mt-8 mb-4">
                Discover our upcoming news
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
                {news.map((news: any) => (
                <div
                    key={news.id}
                    className="relative flex flex-col bg-secondary-500/30 shadow-sm rounded-lg w-[430px] justify-between"
                >
                    {news.location && (
                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(news.location)}&output=embed`}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="rounded-t-lg"
                        ></iframe>
                    )}
                    <div className="fle flex-col items-start p-5">
                        <div className="flex items-center mb-4">
                            <h5 className="text-slate-800 text-xl font-semibold">
                                {news.title.length > 30 ? news.title.slice(0, 25) + "..." : news.title}
                            </h5>
                        </div>
                        <p className="block text-slate-600 leading-normal font-light mb-4">
                        {news.news_date} <br />
                        </p>
                        <div>
                        <div className="flex justify-between">
                            <div className="bg-secondary-500 text-secondary-100 px-3 py-1 rounded-full">
                                {news.category}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}