import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const Avatar = (props: any) => {
  let avatar_src: any;

  if (
    window.location.pathname.includes('join') ||
    window.location.pathname.includes('createretrowithtemplate') ||
    window.location.pathname.includes('startRetro') ||
    window.location.pathname.includes('pulsecheck') ||
    window.location.pathname.includes('board') ||
    window.location.pathname.includes('report')
  ) {
    avatar_src = '/avatars/animals/' + props.avatar + '.svg';
  } else if (!window.location.pathname.includes('join')) {
    avatar_src = '/avatars/' + props.avatar + '.svg';
  }

  return (
    <LazyLoadImage
      className={`${
        (window.location.pathname.includes('join') ||
          window.location.pathname.includes('createretrowithtemplate')) &&
        props.avatar == props.selectedAvatar
          ? 'selectedAvatar'
          : 'avatar'
      }`}
      style={props.css}
      src={avatar_src}
      onClick={() => {
        props.onClickAvatar(props.avatar);
      }}
    />
  );
};

export default Avatar;
