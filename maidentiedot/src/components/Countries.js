const Countries = ({countries, handleShow}) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }
    else {
        return (
            <ul>
                {countries.map(country => 
                    <li key={country['name']['common']}>
                        {country['name']['common']}&nbsp;
                        <button type="button" onClick={() => handleShow(country)}>
                            show
                        </button>
                    </li>
                )}
            </ul>
        )
    }
}

export default Countries