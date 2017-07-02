import * as React from 'react';
import Vacancy from './lib/Vacancy';
import Category from './lib/Category';
import StatBlock from './components/Statblock';
import * as qs from 'qs';

interface Categories {
  [index: string]: Category;
}

const zpReq = async () =>
  fetch(`https://api.zp.ru/v1/vacancies/?${
    qs.stringify({
      average_salary: true,
      categories_facets: true,
      geo_id: 826,
      highlight: true,
      is_new_only: true,
      period: 'today',
      search_type: 'fullThrottle',
    })
  }`)
  .then(r => r.json());

class App extends React.Component<{}, {}> {
  state: {
    categories: Categories;
    vacancies: Array<Vacancy>;
  };
  constructor() {
    super();
    this.state = {
      categories: {},
      vacancies: [],
    };
  }

  getVacancies = async () => {
    const req: {
      metadata: {
        categories_facets: Array<Category>;
      };
      vacancies: Array<Vacancy>;
    } = await zpReq();
    const categories: Categories = {};
    req.metadata.categories_facets.map((category: Category) => categories[category.title] = category);
    this.setState({ categories, vacancies: req.vacancies });
  }

  componentDidMount() {
    this.getVacancies();
  }
  render() {
    const vacanciesByCategories: {
      [index: string]: number;
    } = {};
    const wordsFromHeaders: {
      [index: string]: number;
    } = {};

    this.state.vacancies.map((vacancy) => {
      vacancy.rubrics.map((category) => {
        if (!vacanciesByCategories[category.title]) {
          vacanciesByCategories[category.title] = 0;
        }
        vacanciesByCategories[category.title]++;
      });
      vacancy.header.split(' ').map((wordRaw) => {
        const word = wordRaw.toLowerCase();
        if (word.length > 5 ) {
          if (!wordsFromHeaders[word]) {
            wordsFromHeaders[word] = 0;
          }
          wordsFromHeaders[word]++;
        }
      });
    });
    const topCategoriesByVacancies: Array<string> = Object.keys(vacanciesByCategories).sort((a, b) => {
      return vacanciesByCategories[b] - vacanciesByCategories[a];
    });
    const topHeaderWords: Array<string> = Object.keys(wordsFromHeaders).sort((a, b) => {
      return wordsFromHeaders[b] - wordsFromHeaders[a];
    });

    return (
      <div className="App" style={{marginTop: '80px'}}>
        <div className="container">
          <StatBlock header="Все объявления за сегодня">
            <table>
              <thead>
                <tr>
                  <th>Заголовок вакансии</th>
                  <th colSpan={2}>рубрика</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.vacancies.map((vacancy: Vacancy) => (
                    <tr key={vacancy.id}>
                      <td>{vacancy.header}</td>
                      <td>
                      {
                        vacancy.rubrics.map((current: Category, index: number) => {
                          if (index > 0) {
                            return `, ${current.title}`;
                          } else {
                            return current.title;
                          }
                        })
                      }
                      </td>
                      <th><a href={`http://zp.ru${vacancy.url}`}>ссылка</a></th>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </StatBlock>
          <StatBlock header="Топ рубрик по количеству вакансий">
            <table>
              <thead>
                <tr>
                  <th>Рубрика</th>
                  <th>количество вакансий</th>
                </tr>
              </thead>
              <tbody>
                {
                  topCategoriesByVacancies.map((categoryName: string) => (
                    <tr key={categoryName}>
                      <td>{categoryName}</td>
                      <td>{vacanciesByCategories[categoryName]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </StatBlock>
          <StatBlock header="Топ слов по упоминанию в заголовках вакансий">
            <table>
              <thead>
                <tr>
                  <th>Рубрика</th>
                  <th>количество вакансий</th>
                </tr>
              </thead>
              <tbody>
                {
                  topHeaderWords.map((keyword: string) => (
                    <tr key={keyword}>
                      <td>{keyword}</td>
                      <td>{wordsFromHeaders[keyword]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </StatBlock>
        </div>
      </div>
    );
  }
}

export default App;
