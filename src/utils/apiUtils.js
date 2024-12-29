import axios from 'axios';

export const fetchWordData = async (word, source, setWordData, setSuccessMessage) => {
  try {
    const response = await axios.get(`/api/fetch-word-${source}`, {
      params: { word }
    });
    const autoFilledData = response.data;

    setWordData((prevData) => ({
      ...prevData,
      ...(source === 'eng'
        ? {
            translation: (prevData.translation ? prevData.translation + '\n' : '') + (autoFilledData.eng_data?.definitions || ''),
            category: (prevData.category ? prevData.category : (autoFilledData.eng_data?.PoS || '')),
            synonyms: (prevData.synonyms ? prevData.synonyms + '\n' : '') + (autoFilledData.eng_data?.synonyms || ''),
            example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.eng_data?.examples || ''),
            word_formation: (prevData.word_formation ? prevData.word_formation + '\n' : '') + (autoFilledData.eng_data?.etymology || '')
          }
        : source === 'fi'
        ? {
            comment: (prevData.comment ? prevData.comment + '\n' : '') + (autoFilledData.fi_data?.definitions || ''),
            example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.fi_data?.examples || '')
          }
        : {
            // Handling slang data
            comment: (prevData.comment ? prevData.comment + '\n' : '') + (autoFilledData.slang_data?.description || ''),
            example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.slang_data?.example || '')
          })
    }));

    setSuccessMessage(
      source === 'eng' && autoFilledData.eng_data?.error
        ? 'Слово не найдено в английской Wiki'
        : source === 'fi' && autoFilledData.fi_data.definitions === ''
        ? 'Слово не найдено в финской Wiki'
        : source === 'slang' && autoFilledData.slang_data.word === 'n/a'
        ? 'Слово не найдено в сленговом словаре'
        : source === 'eng'
        ? 'Данные успешно загружены из английской Wiki'
        : source === 'fi'
        ? 'Данные успешно загружены из финской Wiki'
        : source === 'slang'
        ? 'Данные успешно загружены из сленгового словаря'
        : 'Данные успешно загружены'
    );
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    setSuccessMessage('Ошибка при загрузке данных');
  }
};
