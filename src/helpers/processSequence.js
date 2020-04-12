/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { __, allPass, andThen, gte, ifElse, length, lte, otherwise, pipe, prop, tap, test } from 'ramda';

const api = new Api();

// Функции валидации строк
const lengthLessThan10 = pipe(length, lte(__, 10));
const lengthGreaterThan2 = pipe(length, gte(__, 2));
const hasOnlyDigitsAndDot = test(/^(\d+\.)?\d+$/);

const stringIsValid = allPass([lengthLessThan10, lengthGreaterThan2, hasOnlyDigitsAndDot]);

// Функции преобразования чисел
const stringToNumber = (string) => Number(string);
const roundNumber = (number) => Math.round(number);
const squaringNumber = (number) => Math.pow(number, 2);
const mod3 = (number) => number % 3;

// API
const convertFromDecimalToBinary = (number) => api.get('https://api.tech/numbers/base', { number, from: 10, to: 2 });
const getAnimalByNumber = (number) => api.get(`https://animals.tech/${number}`, {});

/**
 * 1. Берем строку N. Пишем изначальную строку в writeLog
 * 2. Строка валидируется по следующим правилам:
 *    - кол-во символов в числе должно быть меньше 10
 *    - кол-во символов в числе должно быть больше 2
 *    - число должно быть положительным
 *    - символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
 * В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
 * 3. Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog
 * 4. C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
 * 5. Взять кол-во символов в полученном от API числе записать в writeLog
 * 6. Возвести в квадрат с помощью Javascript записать в writeLog
 * 7. Взять остаток от деления на 3, записать в writeLog
 * 8. C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
 * 9. Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге
 */
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const stopProcessOnStep2 = () => handleError('ValidationError');

    const doStep8 = pipe(
        getAnimalByNumber,
        andThen(pipe(
            prop('result'),
            tap(writeLog),
            handleSuccess,
        )),
        otherwise(handleError),
    );

    const doStep7 = pipe(mod3, tap(writeLog), doStep8);

    const doStep6 = pipe(squaringNumber, tap(writeLog), doStep7);

    const doStep5 = pipe(length, tap(writeLog), doStep6);

    const doStep4 = pipe(
        convertFromDecimalToBinary,
        andThen(pipe(
            prop('result'),
            tap(writeLog),
            doStep5,
        )),
        otherwise(handleError),
    );

    const doStep3 = pipe(stringToNumber, roundNumber, doStep4);

    const doStep2 = ifElse(stringIsValid, doStep3, stopProcessOnStep2);

    const doStep1 = pipe(tap(writeLog), doStep2);

    return doStep1(value);
};

export default processSequence;
