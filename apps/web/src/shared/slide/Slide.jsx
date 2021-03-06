import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  _slide,
  _carousel,
  _float,
  _shadow,
  _list,
  _description,
  _prev,
  _next,
  _gradient,
} from './Slide.styled';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { IconChevronRight } from 'design/icons/chevron-right.icon';
import { map } from 'lodash';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_SPELL } from 'core/remix/state';
import usePrevious from 'core/hooks/usePrevious';

const Slide = ({ list, items }) => {
  const [index, setIndex] = useState(0);
  const prev_index = usePrevious(index);
  const [, setSpell] = useRemix(GAME_SPELL);
  const carousel_ref = useRef();
  const height = 100;

  useEffect(() => {
    if (list?.length > 0 && (prev_index !== index || index === 0)) {
      setSpell(list?.[index]);
    }
  }, [index, list?.length]);

  const list_items = useMemo(() => {
    let count = 0;
    if (items?.length)
      return map(items, ({ Item }, key) => {
        const num = count;
        count++;
        return (
          <Item count={num} index={index} height={height} info={list?.[key]} />
        );
      });
  }, [items, index]);

  const Details = items?.[index]?.Details;
  const item = list?.[index];

  return (
    <_slide>
      <_carousel ref={carousel_ref}>
        <_float>
          <_float>
            <_gradient />
          </_float>
          <_prev onClick={() => index && setIndex(index - 1)}>
            <IconChevronLeft />
          </_prev>
        </_float>
        <_list>{list_items}</_list>
        <_float $right>
          <_next
            onClick={() => index < items.length - 1 && setIndex(index + 1)}
          >
            <IconChevronRight />
          </_next>
          <_shadow $right>
            <_gradient $right />
          </_shadow>
        </_float>
      </_carousel>
      <_description>{!!Details && <Details item={item} />}</_description>
    </_slide>
  );
};

export default Slide;
