module BuildsHelper
  def class_config(character_class)
    YAML.load_file("config/classes/#{character_class}.yml")    
  end

  def at_wills(character_class)
    powers("at_will", character_class)
  end

  def dailys(character_class)
    powers("daily", character_class)
  end 

  def encounters(character_class)
    powers("encounter", character_class)
  end 

  def skills(character_class)
    powers("skill", character_class)
  end 

private

  def powers(type, character_class)
    conf = class_config(character_class)
    conf["powers"].select{|k,v| v["type"] == type}.collect{|k,v| k} 
  end
end
