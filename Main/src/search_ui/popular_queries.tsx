type PopularQueriesProp = {
    queries: string[];
};

export default function PopularQueries({ queries }: PopularQueriesProp) {
    return (
        <section className="popularNow">
            <h2>실시간 인기 검색어</h2>
            <div className="columns">
                {queries
                    .reduce((pv, cv) => {
                        if (pv.length === 0 || pv[pv.length - 1].length >= 5)
                            pv.push([]);

                        pv[pv.length - 1].push(cv);

                        return pv;
                    }, [] as string[][])
                    .map((i, columnIdx) => (
                        <ol className="column">
                            {i.map((j, idx) => (
                                <li>
                                    <div className="marker">
                                        {columnIdx * 5 + idx + 1}
                                    </div>
                                    <a href={`?query=${encodeURIComponent(j)}`}>
                                        {j}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    ))}
            </div>
        </section>
    );
}
