import Link from "next/link";
import { getNews, NewsItem } from "../app/requests/news";

export default async function News() {
    const news = await getNews();
    const displayedNews = news.slice(0, 6);

    return (
        <div className="w-full flex flex-col items-center mb-30" id="news">
                <div className="w-full justify-center flex">
                    <div className="flex flex-col gap-5 text-left md:text-center">
                        <h1 className="text-3xl font-medium leading-tight text-secondary-100">
                        Some news
                        </h1>
                        <p className="text-lg max-w-2xl">
                            Here you will find the latest news and updates about our platform.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
                {displayedNews.map((newsItem: NewsItem) => (
                <Link
                    href={`/news/${newsItem.id}`}
                    key={newsItem.id}
                    className="relative flex flex-col bg-secondary-500/30 hover:scale-105 transform duration-300 shadow-sm rounded-lg w-[430px] justify-between"
                >
                    {newsItem.location && (
                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(newsItem.location)}&output=embed`}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="rounded-t-lg"
                        ></iframe>
                    )}
                    <div className="p-5">
                        <div className="flex items-center mb-4">
                            <h5 className="text-slate-800 text-xl font-semibold">
                                {newsItem.title.length > 25 ? newsItem.title.slice(0, 25) + "..." : newsItem.title}
                            </h5>
                        </div>
                        <p className="block text-slate-600 leading-normal font-light mb-4">
                        {newsItem.news_date} <br />
                        </p>
                        <div>
                            <div className="flex justify-between">
                                <div className="bg-secondary-500 text-secondary-100 px-3 py-1 rounded-full">
                                    {newsItem.category}
                                </div>
                                <p className="text-slate-800 font-semibold text-sm hover:underline flex items-center text-right">
                                    Learn More
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                ))}
                <Link
                    href="/news"
                    className="px-6 py-3 text-sm font-medium rounded-md bg-secondary-300 text-white hover:bg-secondary-200 transition-colors duration-300"
                >
                    See all news
                </Link>
            </div>
        </div>
    );
}
