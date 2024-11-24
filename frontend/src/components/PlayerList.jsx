import Player from "./Player"
export default function PlayerList() {
    const players = [
        {
            "id": "1",
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "dateOfBirth": "2002-12-12",
            "height": "194",
            "weight": "106",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "You're only one step away from the win.",
            "stats": {
                "AVG": "0.707",
                "OBP": "1.111",
                "SO": "453",
                "BB": "231",
                "ERA": "1.36",
                "H": "8482"
            }
        },
        {
            "id": "2",
            "firstName": "Petar",
            "lastName": "Petrov",
            "dateOfBirth": "1995-03-15",
            "height": "200",
            "weight": "90",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Hard work beats talent when talent doesn’t work hard.",
            "stats": {
                "AVG": "0.693",
                "OBP": "1.043",
                "SO": "401",
                "BB": "198",
                "ERA": "1.57",
                "H": "7950"
            }
        },
        {
            "id": "3",
            "firstName": "Georgi",
            "lastName": "Dimitrov",
            "dateOfBirth": "1988-07-22",
            "height": "186",
            "weight": "85",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Success is the sum of small efforts repeated daily.",
            "stats": {
                "AVG": "0.714",
                "OBP": "1.112",
                "SO": "475",
                "BB": "212",
                "ERA": "1.42",
                "H": "8256"
            }
        },
        {
            "id": "4",
            "firstName": "Maria",
            "lastName": "Nikolova",
            "dateOfBirth": "2001-09-30",
            "height": "172",
            "weight": "63",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Dream big and dare to fail.",
            "stats": {
                "AVG": "0.725",
                "OBP": "1.099",
                "SO": "421",
                "BB": "225",
                "ERA": "1.48",
                "H": "8024"
            }
        },
        {
            "id": "5",
            "firstName": "Dimitar",
            "lastName": "Popov",
            "dateOfBirth": "1990-06-10",
            "height": "188",
            "weight": "92",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Perseverance is the key to unlocking potential.",
            "stats": {
                "AVG": "0.699",
                "OBP": "1.102",
                "SO": "440",
                "BB": "210",
                "ERA": "1.54",
                "H": "7987"
            }
        },
        {
            "id": "6",
            "firstName": "Kalina",
            "lastName": "Vasileva",
            "dateOfBirth": "1998-01-18",
            "height": "170",
            "weight": "58",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Your attitude determines your altitude.",
            "stats": {
                "AVG": "0.713",
                "OBP": "1.108",
                "SO": "410",
                "BB": "215",
                "ERA": "1.51",
                "H": "7923"
            }
        },
        {
            "id": "7",
            "firstName": "Simeon",
            "lastName": "Yanev",
            "dateOfBirth": "1992-11-05",
            "height": "182",
            "weight": "88",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Strive for progress, not perfection.",
            "stats": {
                "AVG": "0.702",
                "OBP": "1.103",
                "SO": "460",
                "BB": "220",
                "ERA": "1.49",
                "H": "8204"
            }
        },
        {
            "id": "8",
            "firstName": "Ivana",
            "lastName": "Georgieva",
            "dateOfBirth": "2000-02-14",
            "height": "168",
            "weight": "60",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Nothing worth having comes easy.",
            "stats": {
                "AVG": "0.718",
                "OBP": "1.110",
                "SO": "430",
                "BB": "210",
                "ERA": "1.47",
                "H": "8111"
            }
        },
        {
            "id": "9",
            "firstName": "Todor",
            "lastName": "Iliev",
            "dateOfBirth": "1996-05-25",
            "height": "192",
            "weight": "98",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Champions keep playing until they get it right.",
            "stats": {
                "AVG": "0.692",
                "OBP": "1.100",
                "SO": "500",
                "BB": "230",
                "ERA": "1.40",
                "H": "8350"
            }
        },
        {
            "id": "10",
            "firstName": "Vasil",
            "lastName": "Todorov",
            "dateOfBirth": "1994-08-19",
            "height": "190",
            "weight": "94",
            "placeOfBirth": "Bulgaria",
            "image": "https://placehold.co/150x200",
            "battingSide": "L",
            "throwingArm": "R",
            "quote": "Victory is in the effort, not just the result.",
            "stats": {
                "AVG": "0.705",
                "OBP": "1.105",
                "SO": "490",
                "BB": "218",
                "ERA": "1.45",
                "H": "8082"
            }
        },
    ]
    const letters = [
        "A", 'B', "C", "D", "E", "F", "G", "H", "I", "J", 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]
    const filteredLetters = letters.map((letter) => { return { label: letter, value: players.filter((player) => player.firstName.charAt(0) === letter) } }).filter((letter) => letter.value.length > 0)
    return (
        <div className="w-full flex flex-row pt-10 gap-6">
            <div className="w-10">
                <div className="w-6 sticky top-[20vh] rounded-lg p-2 bg-white text-primary_2 text-4xs flex flex-col justify-around items-center font-semibold">{filteredLetters.map((letter) => <a className="px-[4px] text-center rounded-full hover:bg-primary_2 hover:text-white cursor-pointer" href={`#section-${letter.label}`}>{letter.label}</a>)}</div>
            </div>
            <div className="flex-1">
                {filteredLetters.map((letter) => <section id={`section-${letter.label}`} className="w-full flex flex-col gap-8 scroll-mt-[10vh]">
                    <div>
                        <div className="text-3xl font-semibold">{letter.label}</div>
                        <hr className="w-full mt-2 border-t-2 border-gray-800"></hr>
                    </div>
                    <div className="grid grid-cols-5 gap-8 py-2">
                        {letter.value.map((player) =>
                            <Player {...player} />)
                        }
                    </div>
                </section>)}
            </div>
        </div>)
}