package com.bruno.restapi.exception;

public class DisciplinaNaoEncontradaException extends Exception {

    private static final long serialVersionUID = 1L;
    private int codigo;

    public DisciplinaNaoEncontradaException(String msg) {
        super(msg);
    }

    public DisciplinaNaoEncontradaException(int codigo, String msg) {
        super(msg);
        this.codigo = codigo;
    }

    public int getCodigoDeErro() {
        return codigo;
    }
}