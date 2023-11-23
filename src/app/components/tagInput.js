import React, { useState } from 'react';
import { Input, Tag } from 'antd';

const { CheckableTag } = Tag;

const TagInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputValue('');
  };

  const handleTagClose = (removedTag) => {
    const updatedTags = tags.filter(tag => tag !== removedTag);
    setTags(updatedTags);
  };

  return (
    <div>
      {tags.map(tag => (
         <Tag className='customTagSize'
          key={tag}
          closable
          onClose={() => handleTagClose(tag)}
        >
          {tag}
        </Tag>
       
      ))}

      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </div>
  );
};

export default TagInput;
