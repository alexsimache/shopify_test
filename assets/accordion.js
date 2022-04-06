
const cityName = document.getElementById('cityName').value;
const apiKey = document.getElementById('apiKey').value;

const renderData = async () => {
  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(resp) { return resp.json() })
    .then(function(data) { drawData(data) })
    .catch(function(e) { console.error(e?.message) });
};

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

const drawData = (data) => {
  const target = document.querySelector(".accordion-content");
  let html = '';
  Object.entries(data).forEach(([key, value]) => {
    html +=
      `<article class="accordion__item" data-accordion-item>
          	<button class="accordion__button" data-accordion-button></button>
			<h3 class="accordion__item-header">${key}<span class="accordion__item-header-icon" data-accordion-button-icon></span></h3>
          	<div class="accordion__content" data-accordion-content>
               <p>${JSON.stringify(value)}</p>
          	</div>
        </article>`;
  });
  target.innerHTML += html;
  accordionLogic();
};

window.onload = () => {
  renderData().then(() => {});
};
