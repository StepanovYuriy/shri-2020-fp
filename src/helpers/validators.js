/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    allPass,
    complement,
    converge,
    countBy,
    equals,
    filter,
    gt,
    gte,
    identity,
    isEmpty,
    pipe,
    prop,
    propEq,
    values,
} from 'ramda';

// Константы цветов
const WHITE = 'white';
const RED = 'red';
const ORANGE = 'orange';
const GREEN = 'green';
const BLUE = 'blue';

// Константы фигур
const STAR = 'star';
const SQUARE = 'square';
const TRIANGLE = 'triangle';
const CIRCLE = 'circle';

// Звезда
const hasWhiteStar = propEq(STAR, WHITE);
const hasRedStar = propEq(STAR, RED);

// Квадрат
const getSquareColor = prop(SQUARE);
const hasOrangeSquare = propEq(SQUARE, ORANGE);
const hasGreenSquare = propEq(SQUARE, GREEN);

// Треугольник
const getTriangleColor = prop(TRIANGLE);
const hasWhiteTriangle = propEq(TRIANGLE, WHITE);
const hasGreenTriangle = propEq(TRIANGLE, GREEN);

// Круг
const hasWhiteCircle = propEq(CIRCLE, WHITE);
const hasBlueCircle = propEq(CIRCLE, BLUE);

// Количество
const maxOne = complement(gt(__, 1)); // lte не работает с undefined, пришлось так #костыль
const minTwo = gte(__, 2);
const minThree = gte(__, 3);
const equalsOne = equals(__, 1);
const equalsTwo = equals(__, 2);
const equalsFour = equals(__, 4);

// Количество по цветам
const getCountColors = pipe(values(), countBy(identity));
const getCountWhite = pipe(getCountColors, prop(WHITE));
const getCountGreen = pipe(getCountColors, prop(GREEN));
const getCountRed = pipe(getCountColors, prop(RED));
const getCountBlue = pipe(getCountColors, prop(BLUE));

// Остальное
const isNotEmpty = complement(isEmpty);
const maxOneWhiteShape = pipe(getCountWhite, maxOne);
const minThreeShapesSameColor = pipe(getCountColors, filter(minThree), isNotEmpty);

const twoGreenShapes = pipe(getCountGreen, equalsTwo);
const oneRedShape = pipe(getCountRed, equalsOne);

const allShapes = (color) => pipe(getCountColors, prop(color), equalsFour);

const sameColorForTriangleAndSquare = converge(equals, [getTriangleColor, getSquareColor]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([hasRedStar, hasGreenSquare, hasWhiteTriangle, hasWhiteCircle]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(getCountGreen, minTwo);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [getCountRed, getCountBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([hasBlueCircle, hasRedStar, hasOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = allPass([minThreeShapesSameColor, maxOneWhiteShape]);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([twoGreenShapes, hasGreenTriangle, oneRedShape]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allShapes(ORANGE);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = allPass([complement(hasRedStar), complement(hasWhiteStar)]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allShapes(GREEN);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = allPass([sameColorForTriangleAndSquare, complement(hasWhiteTriangle)]);
