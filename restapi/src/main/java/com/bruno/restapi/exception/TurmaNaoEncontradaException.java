package com.bruno.restapi.exception;

public class TurmaNaoEncontradaException extends Exception {

    private static final long serialVersionUID = 1L;

    private int codigo;

    public TurmaNaoEncontradaException(String msg) {
        super(msg);
    }

    public TurmaNaoEncontradaException(int codigo, String msg) {
        super(msg);
        this.codigo = codigo;
    }

    public int getCodigoDeErro() {
        return codigo;
    }
}