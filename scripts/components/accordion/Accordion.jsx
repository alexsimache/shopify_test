import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { useInView } from "react-intersection-observer";

const Accordion = () => {
  const cityName = document.getElementById('cityName').value;
  const apiKey = document.getElementById('apiKey').value;
  const [data, setData] = useState({});
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    threshold: 0,
  });
  const accordionLogic = () => {
    const accordionItems = document.querySelectorAll('[data-accordion-item]');

    accordionItems.forEach((item) => {
      const button = item.querySelector('[data-accordion-button]');
      const icon = item.querySelector('[data-accordion-button-icon]');
      const content = item.querySelector('[data-accordion-content]');

      window.addEventListener('resize', () => {
        if (content.getAttribute('data-accordion-content') === 'open') {
          content.style.height = 'auto';
          const contentHeight = content.scrollHeight;
          content.style.height = contentHeight + "px";
        }
      });

      button.addEventListener('click', () => {
        if (content.getAttribute('data-accordion-content') !== 'open') {
          const contentHeight = content.scrollHeight;
          icon.setAttribute('data-accordion-button-icon', 'open');
          content.setAttribute('data-accordion-content', 'open');
          content.style.height = contentHeight + "px";
        } else {
          icon.setAttribute('data-accordion-button-icon', 'closed');
          content.setAttribute('data-accordion-content', 'closed');
          content.style.height = '0';
        }
      });
    });
  };

  const getData = () => {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, {})
      .then((resp) => resp.json())
      .then((weatherData) => setData(weatherData))
      .catch((e) => { console.error(e?.message) });
  }

  useEffect(() => {
    console.warn(`lazy ${inView}`);
    if (!inView) return;
    getData().then(() => accordionLogic())
  }, [inView]);

  const renderItem = (key, value) => {
    return (
      <article className="accordion__item" data-accordion-item="" key={key}>
        <button className="accordion__button" data-accordion-button=""/>
        <h3 className="accordion__item-header">{key}
          <span className="accordion__item-header-icon" data-accordion-button-icon="" />
        </h3>
        <div className="accordion__content" data-accordion-content="">
          <p>{JSON.stringify(value)}</p>
        </div>
      </article>
    )
  }
  return (
    <section className="accordion-wrapper" ref={ref}>
      {inView ? (
        <div className="container">
          <div className="accordion">
            <div className="accordion-content">
              {data ? (
                <>
                  {Object.entries(data).map(([key, value]) => renderItem(key, value))}
                </>
              ) : (
                <p>Fetching data from weather server...</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

const root = document.getElementById('react-accordion');
ReactDom.render(<Accordion />, root);
