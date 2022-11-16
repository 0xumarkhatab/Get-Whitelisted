import React from "react";
import styles from "../styles/Introduction.module.css";

export default function Introduction(props) {
  let image = props.image;
  const getwhitelisted = () => {
    console.log("whitelisting page");
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.container1}>
        <div className={styles.heading}>
          <h1>{props.heading}</h1>
        </div>
        <div className={styles.intro}>
          <p>{props.intro}</p>
          <div>
            <button className={styles.button} onClick={getwhitelisted}>
              Let{"'s"} Whitelisted
            </button>
          </div>
        </div>
      </div>
      <div className={styles.container2}>
        <img
          className={styles.image}
          src={
            image
              ? image
              : "https://the-media-leader.com/wp-content/uploads/2022/07/adobestock-metaverse-resized.png"
          }
          alt="bordape"
        />
      </div>
    </div>
  );
}
