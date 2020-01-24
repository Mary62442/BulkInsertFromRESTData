import React from 'react';
import './App.scss';
import { useForm } from 'react-hook-form';

function FormComponent({inputs, onFormSubmit, formType}) {

    const { register, handleSubmit, errors } = useForm();

    let inputsToList = inputs.map((e,i) => {
        return (
            <div key={i}>
                <label>{e.label}</label>
                <input  name = {e.name} type = {e.type} ref={register({ required: true })}/>
                {errors[e.name] && <p className = "form-error">* {e.label} is required</p>}
            </div>            
        )
    });
   

    const formSubmit = (formData) => {        
        onFormSubmit({formType, formData})
    }

  return (
    <form className = "form-component" onSubmit={handleSubmit(formSubmit)}>
        {inputsToList}
        <input type="submit" value="Continue"/>
    </form>
  );
}

export default FormComponent;
