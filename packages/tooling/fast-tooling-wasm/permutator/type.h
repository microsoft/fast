#include <stdbool.h>

#ifndef _type_h
#define _type_h

enum Type {
    Number,
    String,
    Boolean,
    Null,
    Object,
    Array
};

extern enum Type type;

union Types
{
    double number;
    char *string;
    bool *boolean;
};

struct PermutatedType
{
    enum Type type;
    union Types t;
};

char* get_type_as_string(enum Type type);

#endif