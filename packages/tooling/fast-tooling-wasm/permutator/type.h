#include <stdbool.h>

#ifndef _type_h
#define _type_h

/**
 * An enum representing all possible JSON schema types
 */
enum Type {
    Number,
    String,
    Boolean,
    Null,
    Object,
    Array
};

extern enum Type type;

/**
 * A union type assigned to PermutatedType
 * which allows for a number of different type
 * assignments
 */
union Types
{
    double number;
    char *string;
    bool *boolean;
};

/**
 * A type which can represent any simple data type
 * such as string, boolean, number etc.
 */
struct PermutatedType
{
    enum Type type;
    union Types t;
};

char* get_type_as_string(enum Type type);

#endif