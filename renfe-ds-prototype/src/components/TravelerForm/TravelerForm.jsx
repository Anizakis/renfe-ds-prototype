import React, { useState } from "react";
import InputText from "../InputText/InputText.jsx";
import "./TravelerForm.css";

// Centralized validation function
function validate(fields, touched) {
  const errors = {};

  // Nombre: obligatorio, solo letras
  if (touched.nombre) {
    if (!fields.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.nombre)) {
      errors.nombre = "Solo letras";
    }
  }

  // Primer apellido: obligatorio, solo letras
  if (touched.apellido1) {
    if (!fields.apellido1.trim()) {
      errors.apellido1 = "El primer apellido es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.apellido1)) {
      errors.apellido1 = "Solo letras";
    }
  }

  // Segundo apellido: opcional, solo letras si tiene valor
  if (touched.apellido2 && fields.apellido2.trim()) {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(fields.apellido2)) {
      errors.apellido2 = "Solo letras";
    }
  }

  // Número de documento: obligatorio si DNI, formato
  if (fields.docType === "DNI" && touched.docNumber) {
    if (!fields.docNumber.trim()) {
      errors.docNumber = "El número de documento es obligatorio";
    } else if (!/^\d{8}\s?[A-Za-z]$/.test(fields.docNumber)) {
      errors.docNumber = "Formato: 00000000 X";
    }
  }

  // Email: obligatorio, formato email
  if (touched.email) {
    if (!fields.email.trim()) {
      errors.email = "El correo es obligatorio";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) {
      errors.email = "Correo no válido";
    }
  }

  // Teléfono: obligatorio, 9 dígitos
  if (touched.phone) {
    if (!fields.phone.trim()) {
      errors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(fields.phone)) {
      errors.phone = "Formato: 000000000";
    }
  }

  return errors;
}

// Componente para el asterisco rojo de requerido
function RequiredAsterisk() {
  return (
    <span
      style={{
        color: "var(--color-danger-600)",
        marginLeft: 2,
        fontSize: "1em",
        fontWeight: 700,
        verticalAlign: "top",
      }}
      aria-hidden="true"
    >
      *
    </span>
  );
}

export default function TravelerForm({ travelerIndex = 1 }) {
  const [fields, setFields] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    docType: "DNI",
    docNumber: "",
    email: "",
    phonePrefix: "+34",
    phone: "",
    familiaNumerosa: false,
  });
  const [touched, setTouched] = useState({});

  // Validate on every render (live validation after blur)
  const errors = validate(fields, touched);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Optionally: live validation after blur (keep touched as is)
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Helper for state/props per field
  function getInputProps(field, isOptional = false) {
    const hasValue = !!fields[field]?.trim();
    const isTouched = !!touched[field];
    const hasError = !!errors[field];

    let state = "default";
    if (isTouched && hasError) state = "error";
    else if (isTouched && !hasError && (hasValue || isOptional)) state = "success";

    // Always reserve space: if no error, use NBSP, never empty string
    const helperText = isTouched && hasError ? errors[field] : "\u00A0";
    const hideHelper = false;

    // Etiqueta con asterisco si es requerido
    let label = "";
    switch (field) {
      case "nombre":
        label = (
          <>
            Nombre
            <RequiredAsterisk />
          </>
        );
        break;
      case "apellido1":
        label = (
          <>
            Primer apellido
            <RequiredAsterisk />
          </>
        );
        break;
      case "docNumber":
        label = fields.docType === "DNI" ? (
          <>
            Número de documento
            <RequiredAsterisk />
          </>
        ) : (
          "Número de documento"
        );
        break;
      case "email":
        label = (
          <>
            Correo electrónico
            <RequiredAsterisk />
          </>
        );
        break;
      case "phone":
        label = (
          <>
            Teléfono
            <RequiredAsterisk />
          </>
        );
        break;
      case "apellido2":
        label = "Segundo apellido";
        break;
      default:
        label = "";
    }

    return {
      value: fields[field],
      state,
      helperText,
      hideHelper,
      inputId: `${field}-${travelerIndex}`,
      label,
      placeholder:
        field === "nombre"
          ? "Nombre"
          : field === "apellido1"
          ? "Primer apellido"
          : field === "apellido2"
          ? "Segundo apellido"
          : field === "docNumber"
          ? "Número de documento"
          : field === "email"
          ? "Correo electrónico"
          : field === "phone"
          ? "Teléfono"
          : "",
      size: "m",
      inputProps: {
        name: field,
        onBlur: handleBlur,
        autoComplete: "off",
      },
      onChange: handleChange,
    };
  }

  return (
    <div className="traveler-card">
      <div className="traveler-card__section">
        <form className="traveler-form" autoComplete="off">
          <fieldset className="traveler-form__fieldset">
            <legend className="traveler-form__legend">Datos Personales</legend>
            <div className="traveler-form__row">
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("nombre")} />
              </div>
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("apellido1")} />
              </div>
            </div>
            <div className="traveler-form__row">
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("apellido2", true)} />
              </div>
              <select
                className="traveler-form__input traveler-form__select"
                name="docType"
                value={fields.docType}
                onChange={handleChange}
              >
                <option>DNI</option>
                <option>NIE</option>
                <option>Pasaporte</option>
              </select>
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("docNumber")} />
              </div>
            </div>
            <div className="traveler-form__row">
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("email")} />
              </div>
              <select
                className="traveler-form__input traveler-form__select"
                name="phonePrefix"
                value={fields.phonePrefix}
                onChange={handleChange}
              >
                <option>+34</option>
                <option>+33</option>
                <option>+44</option>
              </select>
              <div style={{ flex: 1 }}>
                <InputText {...getInputProps("phone")} />
              </div>
            </div>
            <div className="traveler-form__row traveler-form__row--checkbox">
              <label className="traveler-form__checkbox-label">
                <input
                  type="checkbox"
                  className="traveler-form__checkbox"
                  name="familiaNumerosa"
                  checked={fields.familiaNumerosa}
                  onChange={handleChange}
                />{" "}
                Familia numerosa
              </label>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="traveler-card__accordion">
        <details>
          <summary>Tarjeta Más Renfe</summary>
        </details>
        <details>
          <summary>Descuentos, códigos promocionales / vales descuento</summary>
        </details>
        <details>
          <summary>Accesibilidad</summary>
        </details>
      </div>
    </div>
  );
}
