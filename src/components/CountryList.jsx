/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add some cities to get started" />;

  const countries = cities.reduce((a, c) => {
    if (!a.map((el) => el.country).includes(c.country))
      return [...a, { country: c.country, emoji: c.emoji }];
    else return a;
  }, []);

  return (
    <div className={styles.countryList}>
      {countries.map((c) => (
        <CountryItem key={c.country} country={c} />
      ))}
    </div>
  );
}

export default CountryList;
