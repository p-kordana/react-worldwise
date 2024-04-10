/* eslint-disable react/prop-types */
import styles from "./CountryItem.module.css";
import { flagEmojiToPng } from "./ConvertEmoji";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji && flagEmojiToPng(country.emoji)}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
