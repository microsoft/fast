//! Validate build metadata without retaining its strings, keys or containers.
use serde::de::{Deserialize, Deserializer, MapAccess, SeqAccess, Visitor};
use serde_json::Value;
use std::fmt;

enum Key {
    Entry,
    Templates,
    Sources,
    Other,
}

impl<'de> Deserialize<'de> for Key {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct KeyVisitor;
        impl Visitor<'_> for KeyVisitor {
            type Value = Key;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a metadata key")
            }

            fn visit_str<E: serde::de::Error>(self, key: &str) -> Result<Key, E> {
                Ok(match key {
                    "entry" => Key::Entry,
                    "templates" => Key::Templates,
                    "templateSources" => Key::Sources,
                    _ => Key::Other,
                })
            }
        }
        deserializer.deserialize_str(KeyVisitor)
    }
}

enum Metadata {
    String,
    Object(bool),
    Array(bool),
    Other,
}

impl<'de> Deserialize<'de> for Metadata {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct MetadataVisitor;
        impl<'de> Visitor<'de> for MetadataVisitor {
            type Value = Metadata;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("JSON build metadata")
            }

            fn visit_unit<E: serde::de::Error>(self) -> Result<Metadata, E> {
                Ok(Metadata::Other)
            }

            fn visit_bool<E: serde::de::Error>(self, _: bool) -> Result<Metadata, E> {
                Ok(Metadata::Other)
            }

            fn visit_i64<E: serde::de::Error>(self, _: i64) -> Result<Metadata, E> {
                Ok(Metadata::Other)
            }

            fn visit_u64<E: serde::de::Error>(self, _: u64) -> Result<Metadata, E> {
                Ok(Metadata::Other)
            }

            fn visit_f64<E: serde::de::Error>(self, _: f64) -> Result<Metadata, E> {
                Ok(Metadata::Other)
            }

            fn visit_str<E: serde::de::Error>(self, _: &str) -> Result<Metadata, E> {
                Ok(Metadata::String)
            }

            fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Metadata, A::Error> {
                let mut strings = true;
                while let Some(value) = seq.next_element::<Metadata>()? {
                    strings &= matches!(value, Metadata::String);
                }
                Ok(Metadata::Array(strings))
            }

            fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Metadata, A::Error> {
                let (mut entry, mut templates, mut sources) = (None, None, None);
                let mut extra = false;
                while let Some((key, value)) = map.next_entry::<Key, Metadata>()? {
                    match key {
                        Key::Entry => entry = Some(matches!(value, Metadata::String)),
                        Key::Templates => templates = Some(matches!(value, Metadata::Object(_))),
                        Key::Sources => sources = Some(matches!(value, Metadata::Array(true))),
                        Key::Other => extra = true,
                    }
                }
                Ok(Metadata::Object(
                    !extra
                        && entry == Some(true)
                        && match (templates, sources) {
                            (Some(valid), None) | (None, Some(valid)) => valid,
                            _ => false,
                        },
                ))
            }
        }
        // Unlike IgnoredAny, ordinary value decoding still checks number ranges
        // and decoded Unicode, including invalid data in overwritten fields.
        deserializer.deserialize_any(MetadataVisitor)
    }
}

pub(super) struct Envelope(pub Value);

impl<'de> Deserialize<'de> for Envelope {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct EnvelopeVisitor;
        impl<'de> Visitor<'de> for EnvelopeVisitor {
            type Value = Envelope;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a FAST artifact envelope")
            }

            fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Envelope, A::Error> {
                let mut fields = serde_json::Map::new();
                while let Some(key) = map.next_key::<String>()? {
                    // Keep field presence and last-key-wins semantics, not build inputs.
                    let value = if key == "inputs" {
                        Value::Bool(matches!(map.next_value()?, Metadata::Object(true)))
                    } else {
                        map.next_value()?
                    };
                    fields.insert(key, value);
                }
                Ok(Envelope(Value::Object(fields)))
            }

            fn visit_unit<E: serde::de::Error>(self) -> Result<Envelope, E> {
                Ok(Envelope(Value::Null))
            }

            fn visit_bool<E: serde::de::Error>(self, _: bool) -> Result<Envelope, E> {
                self.visit_unit()
            }

            fn visit_i64<E: serde::de::Error>(self, _: i64) -> Result<Envelope, E> {
                self.visit_unit()
            }

            fn visit_u64<E: serde::de::Error>(self, _: u64) -> Result<Envelope, E> {
                self.visit_unit()
            }

            fn visit_f64<E: serde::de::Error>(self, _: f64) -> Result<Envelope, E> {
                self.visit_unit()
            }

            fn visit_str<E: serde::de::Error>(self, _: &str) -> Result<Envelope, E> {
                self.visit_unit()
            }

            fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Envelope, A::Error> {
                while seq.next_element::<Metadata>()?.is_some() {}
                Ok(Envelope(Value::Null))
            }
        }
        deserializer.deserialize_any(EnvelopeVisitor)
    }
}
