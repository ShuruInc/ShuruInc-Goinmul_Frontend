type KeywordBubblesProp = {
    bubbles: string[];
    onBubbleClick: (bubbleText: string) => void;
};

export default function KeywordBubbles({
    bubbles,
    onBubbleClick,
}: KeywordBubblesProp) {
    return (
        <section className="keywords display-none">
            <h2>이런 키워드는 어때요?</h2>
            <div className="bubbles">
                {bubbles.map((i) => (
                    <a
                        href="#"
                        className="bubble"
                        onClick={(evt) => {
                            evt.preventDefault();
                            onBubbleClick(i);
                        }}
                    >
                        {i}
                    </a>
                ))}
            </div>
        </section>
    );
}
