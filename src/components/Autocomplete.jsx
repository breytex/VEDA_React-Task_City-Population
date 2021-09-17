import { useEffect, useState, useRef, useCallback } from "react";
import { debounce } from "../debounce";
import "./Autocomplete.css";

const API_URL = "https://api.teleport.org/api/cities?limit=5&search=";

const Autocomplete = ({ onCityClick }) => {
    const [input, setInput] = useState("");
    const [cityChoices, setCityChoices] = useState([]);
    const inFlightRef = useRef();

    useEffect(() => {
        if (!inFlightRef.current && input.length > 0) {
            fetchCitiesByString(input);
        }
    }, [input])

    const fetchCitiesByString = useCallback(
        debounce(async (inputValue) => {
            inFlightRef.current = true;
            const res = await fetch(`${API_URL}${encodeURIComponent(inputValue)}`);

            if (res.status === 200) {
                const body = await res.json();
                setCityChoices(body?._embedded["city:search-results"]);
            }
            inFlightRef.current = false;
        }, 250),
        []
    );
    
    return (
        <span>
            <input type="text"
                value={input}
                onChange={event => {
                    setInput(event.target.value);
                }} />
            {cityChoices && cityChoices.length > 0 && 
            <ul className="city-choices">
                {cityChoices.map(c => (
                    <li key={c.matching_full_name}
                        onClick={() => {
                            onCityClick(c);
                            setCityChoices(null);
                        }}>
                            {c.matching_full_name}
                    </li>
                ))}
            </ul>}
        </span>
    )
}

export default Autocomplete;
